# Use for Celery tasks

# backend/tasks.py

from celery import shared_task
from celery.utils.log import get_task_logger

from .models import StudentCourse
from .models.student_course_tasks import StudentCourseTask
from .models.course_tasks import CourseTask
from .utils.analysis_utils import extract_text, analyze_keywords, analyze_assist_tools_and_prompt

logger = get_task_logger(__name__)


@shared_task(bind=True)
def analyze_single_task(self, task_id):
    """
    分析單個學生作業
    """
    try:
        logger.info(f"開始分析學生作業 ID: {task_id}")
        task = StudentCourseTask.objects.get(id=task_id)

        # 1. 提取文本
        if not task.ocr_content:
            logger.info(f"正在進行 OCR 文字提取，作業 ID: {task_id}")
            ocr_result = extract_text(task, True)
            if not ocr_result['success']:
                logger.error(f"OCR 提取失敗，作業 ID: {task_id}，錯誤: {ocr_result['message']}")
                return {'status': 'FAILURE', 'message': ocr_result['message']}
            # 刷新資料
            task.refresh_from_db()

        # 2. 分析關鍵詞
        logger.info(f"正在進行關鍵詞分析，作業 ID: {task_id}")
        keywords_result = analyze_keywords(task)
        if not keywords_result['success']:
            logger.error(f"關鍵詞分析失敗，作業 ID: {task_id}，錯誤: {keywords_result['message']}")
            return {'status': 'FAILURE', 'message': keywords_result['message']}

        # 3. 分析輔助工具與提示詞
        logger.info(f"正在進行輔助工具與提示詞分析，作業 ID: {task_id}")
        analysis_result = analyze_assist_tools_and_prompt(task)
        if not analysis_result['success']:
            logger.error(f"輔助工具分析失敗，作業 ID: {task_id}，錯誤: {analysis_result['message']}")
            return {'status': 'FAILURE', 'message': analysis_result['message']}

        # 4. 更新分析狀態
        task.is_analyzed = True
        task.save()

        logger.info(f"作業分析完成，作業 ID: {task_id}")

        return {
            'task_id': task_id,
            'status': 'SUCCESS',
        }

    except StudentCourseTask.DoesNotExist:
        logger.error(f"找不到學生作業，ID: {task_id}")
        return {'status': 'FAILURE', 'message': f'找不到 ID 為 {task_id} 的學生作業'}
    except Exception as e:
        logger.error(f"作業分析出現未預期錯誤，作業 ID: {task_id}，錯誤: {str(e)}")
        return {'status': 'FAILURE', 'message': str(e)}


@shared_task(bind=True)
def batch_analyze_tasks(self, course_task_id):
    """
    批量分析指定課程任務的所有學生作業
    """
    try:
        logger.info(f"開始批量分析課程任務 ID: {course_task_id} 的所有學生作業")

        # 獲取該課程任務的所有學生作業
        student_tasks = StudentCourseTask.objects.filter(course_task=course_task_id, is_analyzed=False, task_file__isnull=False)
        print(student_tasks)

        if not student_tasks.exists():
            logger.warning(f"課程任務 ID: {course_task_id} 沒有找到任何學生作業")
            return {
                'status': 'COMPLETED',
                'message': '沒有找到任何學生作業',
                'processed_count': 0,
                'failed_count': 0,
                'successful_tasks': [],
                'failed_tasks': []
            }

        total_tasks = student_tasks.count()
        logger.info(f"找到 {total_tasks} 個學生作業需要分析")

        # 啟動所有分析任務
        task_results = []
        for idx, student_task in enumerate(student_tasks):
            # 檢查作業是否已經分析過
            if student_task.is_analyzed:
                logger.info(f"學生作業 ID: {student_task.id} 已經分析過，跳過")
                task_results.append({
                    'task_id': student_task.id,
                    'status': 'SKIPPED',
                    'message': '作業已經分析過'
                })
                continue

            logger.info(f"啟動作業 ID: {student_task.id} 的分析任務 ({idx + 1}/{total_tasks})")
            result = analyze_single_task.delay(student_task.id)
            task_results.append({
                'task_id': student_task.id,
                'celery_task_id': result.id,
                'status': 'PENDING'
            })

        logger.info(f"批量分析啟動完成，共啟動了 {len(task_results)} 個任務")

        return {
            'status': 'STARTED',
            'message': f'成功啟動 {len(task_results)} 個分析任務',
            'total_tasks': total_tasks,
            'task_details': task_results
        }

    except CourseTask.DoesNotExist:
        logger.error(f"找不到課程任務，ID: {course_task_id}")
        return {'status': 'FAILURE', 'message': f'找不到 ID 為 {course_task_id} 的課程任務'}
    except Exception as e:
        logger.error(f"批量分析啟動失敗，錯誤: {str(e)}")
        return {'status': 'FAILURE', 'message': str(e)}

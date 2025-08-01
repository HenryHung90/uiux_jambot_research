import { useDispatch, useSelector } from 'react-redux';
import {RootState} from "../index";
import { setAlert, closeAlert, setLoading } from '../slices/alertLoadingSlice';

export const useAlertLoading = () => {
  const dispatch = useDispatch();
  const alertState = useSelector((state: RootState) => state.alertLoading.alert);
  const loadingState = useSelector((state: RootState) => state.alertLoading.loading);

  return {
    // Alert states
    alertOpen: alertState.isOpen,
    alertTitle: alertState.title,
    alertMessage: alertState.message,

    // Loading state
    loadingOpen: loadingState.isOpen,

    // Actions
    setAlertLog: (title: string, message: string) => {
      dispatch(setAlert({ title, message }));
    },
    handleAlertClose: () => {
      dispatch(closeAlert());
    },
    setLoadingOpen: (open: boolean) => {
      dispatch(setLoading(open));
    },
  };
};
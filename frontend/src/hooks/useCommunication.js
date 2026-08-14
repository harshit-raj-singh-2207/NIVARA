import useCommunicationStore from '../store/communicationStore';

export const useCommunication = () => {
  const store = useCommunicationStore();
  return store;
};

export default useCommunication;

export const sendSMS = async (to: string, message: string) => {
  try {
    console.log('SMS sent to', to, 'with message:', message);
    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const rentangHariWIB = () => {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const startWib = new Date(Date.now() + WIB_OFFSET_MS);
  startWib.setUTCHours(0, 0, 0, 0);
  const endWib = new Date(startWib.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { startWib: startWib.toISOString(), endWib: endWib.toISOString() };
};

module.exports = { rentangHariWIB };
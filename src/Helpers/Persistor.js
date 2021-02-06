const save = (key, value) => localStorage.setItem(key, value);
const get = key => localStorage.getItem(key);
const remove = key => localStorage.removeItem(key);

const Persistor = {
  save,
  get,
  remove
};
export default Persistor;

import debounce from 'lodash.debounce';

const saveLayout = (getState) => {
  const layout = getState().layout.present.blocks;
  console.log('Auto-saving layout to Contentful:', layout);
};

const debouncedSave = debounce(saveLayout, 1000);

export default store => next => action => {
  const result = next(action);
  if (action.type.startsWith('layout/')) {
    debouncedSave(store.getState);
  }
  return result;
};

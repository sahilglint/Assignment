import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './layoutSlice';
import autosaveMiddleware from './autosaveMiddleware';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, layoutReducer);

export default function storeConfig() {
  const store = configureStore({
    reducer: { layout: persistedReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(autosaveMiddleware),
  });

  const persistor = persistStore(store);

  return { store, persistor };
}

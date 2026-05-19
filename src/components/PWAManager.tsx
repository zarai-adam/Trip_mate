import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAManager() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      console.log('App ready to work offline');
    }
  }, [offlineReady]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      {needRefresh && (
        <div className="fixed bottom-4 right-4 z-[100] p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-sage/10 max-w-sm animate-in fade-in slide-in-from-bottom-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-forest dark:text-gray-100">Update Available</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New content is ready</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => updateServiceWorker(true)}
                className="flex-1 h-10 bg-forest text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-forest/10"
              >
                Reload
              </button>
              <button 
                onClick={() => close()}
                className="flex-1 h-10 bg-gray-50 dark:bg-gray-700 text-gray-400 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

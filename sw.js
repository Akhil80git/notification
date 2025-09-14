
self.addEventListener('push', function(event) {
  let data = { title: 'New Notification', message: 'You have a message', url: '/' };
  if (event.data) {
    try { data = event.data.json(); } catch(e) { console.error(e); }
  }
  const options = {
    body: data.message,
    data: { url: data.url },
    badge: '/favicon.ico',
    icon: '/favicon.ico'
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // focus if exists
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const { title = "Thông báo", body = "Bạn có một thông báo mới" } = data;

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon: "/trello-icon-png-28.jpg",
        })
    );
});

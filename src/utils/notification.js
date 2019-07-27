export const requestPermission = () => {
  if (!Notification || !Notification.requestPermission) {
    throw new Error('Please use Chrome for better experience')
  }
  Notification.requestPermission()
}

export const pushNotification = (title, options) => {
  if (Notification.permission !== 'granted') {
    console.log(new Date().toString(), title, options.body)
  } else {
    new Notification(title, options)
  }
}

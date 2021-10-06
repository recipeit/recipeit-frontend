import { reactive, toRefs } from 'vue'

export default function() {
  const data = reactive({
    userInteracted: false,
    refreshing: false,
    registration: null,
    updateExists: false
  })

  // Store the SW registration so we can send it a message
  // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
  // To alert the user there is an update they need to refresh for
  const updateAvailable = ({ detail }) => {
    data.registration = detail

    if (data.userInteracted) {
      data.updateExists = true
    } else {
      refreshApp()
    }
  }

  // Called when the user accepts the update
  const refreshApp = () => {
    data.updateExists = false
    // Make sure we only send a 'skip waiting' message if the SW is waiting
    if (!data.registration || !data.registration.waiting) return
    // send message to SW to skip the waiting and activate the new SW
    data.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  // Listen for our custom event from the SW registration
  document.addEventListener('swUpdated', updateAvailable, { once: true })

  // Prevent multiple refreshes
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (data.refreshing) return
    data.refreshing = true
    // Here the actual reload of the page occurs
    window.location.reload()
  })

  const handleInteraction = () => {
    data.userInteracted = true
    removeInteractionEvents()
  }

  const setInteractionEvents = () => {
    document.addEventListener('scroll', handleInteraction)
    document.body.addEventListener('keydown', handleInteraction)
    document.body.addEventListener('click', handleInteraction)
    document.body.addEventListener('touchstart', handleInteraction)
  }

  const removeInteractionEvents = () => {
    document.removeEventListener('scroll', handleInteraction)
    document.body.removeEventListener('keydown', handleInteraction)
    document.body.removeEventListener('click', handleInteraction)
    document.body.removeEventListener('touchstart', handleInteraction)
  }

  setInteractionEvents()

  return {
    ...toRefs(data),
    refreshApp
  }
}

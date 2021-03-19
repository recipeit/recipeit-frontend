import { FacebookAppId } from '@/constants'

export function initFacebookSdk() {
  return new Promise(resolve => {
    // wait for facebook sdk to initialize before starting the vue app
    window.fbAsyncInit = function() {
      // eslint-disable-next-line no-undef
      FB.init({
        appId: FacebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v10.0'
      })
      resolve()

      // auto authenticate with the api if already logged in with facebook
      // eslint-disable-next-line no-undef
      // FB.getLoginStatus(({ authResponse }) => {
      //   if (authResponse) {
      //     // console.log(authResponse)
      //     this.$store.dispatch('user/facebookAuth', authResponse.accessToken)
      //     resolve()
      //     // accountService.apiAuthenticate(authResponse.accessToken).then(resolve)
      //   } else {
      //     resolve()
      //   }
      // })
    }

    // load facebook sdk script
    ;(function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  })
}

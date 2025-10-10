package com.panchalsamajapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import org.devio.rn.splashscreen.SplashScreenReactPackage

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override fun getPackages(): List<ReactPackage> {
                val packages = PackageList(this).packages
                // Manually add packages that cannot be autolinked
                packages.add(SplashScreenReactPackage())
                return packages
            }

            override fun getJSMainModuleName(): String = "index"

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
    }
}

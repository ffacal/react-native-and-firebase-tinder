# React Native Firebase Tinder like App - IOS

While this demo has been tested in IOS and works, it is still work in progress.

During my first React Native prototype project I couldn't find a good example of Firebase working with React Native. Instructions described here: https://www.firebase.com/blog/2015-05-29-react-native.html didn't work as I expected. 

I wrote this example based on the following examples:

https://github.com/quuack/react-native-firebase-and-twitter-example
https://github.com/brentvatne/react-native-animated-demo-tinder


Objective-C is far from being my main expertise. Please, don't take this doc as reference for good practices. 

This demo implements Firebase's authentication features and it focuses on Twitter Oauth methods.
Note that Firebase also supports authentication with email & password and custom auth tokens as well as other providers (Facebook, Linkedin, Google, etc.)
You can read the full [iOS authentication guide here](https://www.firebase.com/docs/ios/guide/user-auth.html).

This demo requires that [Cocoapods](https://cocoapods.org/) is installed.

Running the Demo
----------------

Donwload the repository and run the following command in the root folder:

	$ npm install

To download and setup all necessary SDKs, run the following command within ./ios/:

    $ pod install

Next, open `ReactTinderApp.xcworkspace` in XCode (not `ReactTinderApp.xcodeproj`,
since you need to include the Cocoapod dependencies).

You'll then need to edit the files `ReactTinderApp/ViewController.m` and specify the
Firebase app you're using as well as your Twitter API key. 

Don't forget to [enable the relevant OAuth providers](https://www.firebase.com/docs/ios/guide/user-auth.html#section-enable-providers)
in your Firebase app.

Finally, run the demo app in XCode.

React Version: ^0.11.4

Troubleshooting
----------------
If your build fails, check that pod install had run successfuly. If the console throws this warning, most likely you will have to follow the instructions and then re-run the command. 

[!] The `reactAndFirebase [Debug]` target overrides the `OTHER_LDFLAGS` build setting defined in `Pods/Target Support Files/Pods/Pods.debug.xcconfig'. This can lead to problems with the CocoaPods installation
    - Use the `$(inherited)` flag, or
    - Remove the build settings from the target.

[!] The `reactAndFirebase [Release]` target overrides the `OTHER_LDFLAGS` build setting defined in `Pods/Target Support Files/Pods/Pods.release.xcconfig'. This can lead to problems with the CocoaPods installation
    - Use the `$(inherited)` flag, or
    - Remove the build settings from the target.

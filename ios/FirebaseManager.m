//
//  FirebaseManager.m
//  redCreat
//
//  Created by Juan Francisco Facal on 9/28/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

// FirebaseManager.m
#import "FirebaseManager.h"
#import "TwitterAuthHelper.h"

@implementation FirebaseManager {
   RCTResponseSenderBlock _methodCallback;
   Firebase *_ref;
   NSString *_kFirebaseURL;
   NSString *_kTwitterAPIKey;
   NSDictionary *_firebaseCurrentUser;
}

RCT_EXPORT_MODULE();

- (instancetype) init
{
  // The Firebase you want to use for this app
  // You must setup Firebase Login for the various authentication providers in the Dashboard under Login & Auth.
  _kFirebaseURL = @"https://fiery-heat-9681.firebaseio.com";
  
  // The twitter API key you setup in the Twitter developer console
  _kTwitterAPIKey = @"BNpvgvx5AALsiXEKPot9W4v1R";
  
  _ref = [[Firebase alloc] initWithUrl: _kFirebaseURL];
  
  return self;
}

RCT_EXPORT_METHOD(newSession:(RCTResponseSenderBlock)callback) {
  // make sure we have a Firebase url
  if (_kFirebaseURL) {
    _ref = [[Firebase alloc] initWithUrl:_kFirebaseURL];
  }
  
  // save callback for later usage
  _methodCallback = callback;

  if (_kTwitterAPIKey) {
    [self twitterLogin];

  }
  
};

RCT_EXPORT_METHOD(unAuth)
{
  [_ref unauth];
};


RCT_EXPORT_METHOD(authData:(RCTResponseSenderBlock)callback)
{
  FAuthData *authDataRes = [_ref authData];
  NSDictionary *authData;
  
  if (authDataRes.uid) {
    authData = @{
      @"uid": authDataRes.uid
    };
    callback(@[[NSNull null], authData]);
  } else {
    callback(@[[NSNull null], [NSNull null]]);
  }

};

- (void(^)(NSError *, FAuthData *))loginBlockForProviderName:(NSString *)providerName
{
  // this callback block can be used for every login method
  return ^(NSError *error, FAuthData *authData) {
    
    if (error != nil) {
      // there was an error authenticating with Firebase
      NSLog(@"Error logging in to Firebase: %@", error);
      // display an alert showing the error message
      NSString *message = [NSString stringWithFormat:@"There was an error logging into Firebase using %@: %@",
                           providerName,
                           [error localizedDescription]];
      NSLog(message);
      //[self showErrorAlertWithMessage:message];
    } else {
      // all is fine, set the current user and persist it under /users/ path
      self.currentUser = authData;
      [self createFirebaseUser];
    }
  };
}

- (void) createFirebaseUser
{
  
  NSString *provider = self.currentUser.provider ? self.currentUser.provider : @"";
  NSString *username = self.currentUser.providerData[@"username"] ? self.currentUser.providerData[@"username"] : @"";
  NSString *profileImageUrl =self.currentUser.providerData[@"profileImageURL"] ? self.currentUser.providerData[@"profileImageURL"] : @"";
  NSString *displayName = self.currentUser.providerData[@"displayName"] ? self.currentUser.providerData[@"displayName"] : @"";
  NSString *token = self.currentUser.providerData[@"accessToken"] ? self.currentUser.providerData[@"accessToken"] : @"";
  NSString *secret = self.currentUser.providerData[@"accessTokenSecret"] ? self.currentUser.providerData[@"accessTokenSecret"] : @"";
  
  NSDictionary *newUser = @{
                            @"uid": self.currentUser.uid,
                            @"provider": provider,
                            @"username": username,
                            @"profileImageUrl": profileImageUrl,
                            @"displayName": displayName,
                            @"twAccessToken": token,
                            @"twAccessSecret": secret
                            };
  
  _firebaseCurrentUser = newUser;
  
  // Create a child path with a key set to the uid underneath the "users" node
  // This creates a URL path like the following: http://<firebaseurl>/users/<uid>/
  [[[_ref childByAppendingPath:@"users"]
    childByAppendingPath:self.currentUser.uid] setValue:newUser];
  
  RCTResponseSenderBlock callback = _methodCallback;
  callback(@[[NSNull null], newUser]);
}

- (void)twitterLogin
{
  self.twitterAuthHelper = [[TwitterAuthHelper alloc] initWithFirebaseRef:self.ref apiKey:_kTwitterAPIKey];
  [self.twitterAuthHelper selectTwitterAccountWithCallback:^(NSError *error, NSArray *accounts) {
    if (error) {
      NSString *message = [NSString stringWithFormat:@"There was an error logging into Twitter: %@", [error localizedDescription]];
      NSLog(message);
    } else {
      // here you could display a dialog letting the user choose
      // for simplicity we just choose the first
      [self.twitterAuthHelper authenticateAccount:[accounts firstObject]
                                     withCallback:[self loginBlockForProviderName:@"Twitter"]];
      
      // If you wanted something more complicated, comment the above line out, and use the below line instead.
      // [self twitterHandleAccounts:accounts];
    }
  }];
}


/*****************************
 *      ADV TWITTER STUFF    *
 *****************************/
- (void)twitterHandleAccounts:(NSArray *)accounts
{
  // Handle the case based on how many twitter accounts are registered with the phone.
  switch ([accounts count]) {
    case 0:
      // There is currently no Twitter account on the device.
      break;
    case 1:
      // Single user system, go straight to login
      [self.twitterAuthHelper authenticateAccount:[accounts firstObject]
                                     withCallback:[self loginBlockForProviderName:@"Twitter"]];
      break;
    default:
      // For now, go straight to login with the first account found in the phone
      [self.twitterAuthHelper authenticateAccount:[accounts firstObject]
                                     withCallback:[self loginBlockForProviderName:@"Twitter"]];

      break;
  }
}

@end

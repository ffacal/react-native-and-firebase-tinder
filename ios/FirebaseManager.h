//
//  FirebaseManager.h
//  redCreat
//
//  Created by Juan Francisco Facal on 9/28/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

// FirebaseManager.h
#import "RCTBridgeModule.h"//;

#import <Firebase/Firebase.h>//;
#import "TwitterAuthHelper.h"//;

@interface FirebaseManager : NSObject <RCTBridgeModule>

// The Firebase object. We use this to authenticate and interact with Firebase API.
@property (nonatomic, strong) Firebase *ref;

// Twitter Auth Helper library ref
@property (nonatomic, strong) TwitterAuthHelper *twitterAuthHelper;

// Current user authenticated with Firebase
@property (nonatomic, strong) FAuthData *currentUser;

- (void(^)(NSError *, FAuthData *))loginBlockForProviderName:(NSString *)providerName;
- (void) twitterLogin;
- (void) twitterHandleAccounts:(NSArray *)accounts;

@end
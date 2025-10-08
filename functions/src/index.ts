/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions';

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

/**
 * Copyright 2023 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { initializeApp } from 'firebase-admin/app';
// import { getAuth } from 'firebase-admin/auth';
// import { getDatabase } from 'firebase-admin/database';
import { log } from 'firebase-functions/logger';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
// const auth = getAuth();
const db = getFirestore();

/**


New item creation
- update subscribers with entity and IDs for admins
- send email
- add notification to above admin IDs 

Item update
- (also for subcollections)
- check for recent notification
  - yes: delete the old one
- add notification

Entity deleted
- remove subscribers with entity and ID for admin

Entity checked
- notification to creator
- remove subscribers
- archive

Remove role
- get subscriptions for each entity
- remove the id
- remove notifications 

Subscriptions
/Issues
  /Id
    [UserIds]
/Riscossi
  /Id
    [UserIds]

Notifications
User
  /Notifications 
    /NotificationId
			/ entity
        / id
        / type
			/ id
			/ text

*/

/**
 * Triggers when a user gets a new follower and sends a notification. Followers
 * add a flag to `/followers/{followedUid}/{followerUid}`. Users save their
 * device notification tokens to
 * `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
export const sendFollowerNotification = onDocumentUpdated(
  '/issues/{issueId}',
  async (event) => {
    // const oldValue = event.data?.before.data();
    const newValue = event.data?.after.data();

    // check that subscription exists
    const subscribersSnapshot = await db
      .doc(`subscription-issues/${event.params.issueId}`)
      .get();
    const subscribers = subscribersSnapshot.data()?.subscribers;

    const userId = subscribers[0];

    const createdDoc = await db
      .doc(`users/${userId}`)
      .collection('notifications')
      .add({
        // timestamp
        entity: {
          id: event.params.issueId,
          // update to allow more
          type: 'issue',
        },
        text: `New data: ${JSON.stringify(newValue)}`,
      });

    log(createdDoc);

    // // If un-follow we exit the function.
    // if (!event.data.after.val()) {
    //   log(
    //     `User ${event.params.followerUid} unfollowed` +
    //       ` user ${event.params.followedUid} :(`
    //   );
    //   return;
    // }

    // log(
    //   `User ${event.params.followerUid} is now following` +
    //     ` user ${event.params.followedUid}`
    // );
    // const tokensRef = db.ref(
    //   `/users/${event.params.followedUid}/notificationTokens`
    // );
    // const notificationTokens = await tokensRef.get();
    // if (!notificationTokens.hasChildren()) {
    //   log('There are no tokens to send notifications to.');
    //   return;
    // }

    // log(
    //   `There are ${notificationTokens.numChildren()} tokens` +
    //     ' to send notifications to.'
    // );
    // const followerProfile = await auth.getUser(event.params.followerUid);

    // // Notification details.
    // const notification = {
    //   title: 'You have a new follower!',
    //   body:
    //     (followerProfile.displayName ?? 'Someone') + ' is now following you.',
    //   image: followerProfile.photoURL ?? '',
    // };

    // // Send notifications to all tokens.
    // const messages = [];
    // notificationTokens.forEach((child) => {
    //   messages.push({
    //     token: child.key,
    //     notification: notification,
    //   });
    // });
    // const batchResponse = await messaging.sendEach(messages);

    // if (batchResponse.failureCount < 1) {
    //   // Messages sent sucessfully. We're done!
    //   log('Messages sent.');
    //   return;
    // }
    // warn(`${batchResponse.failureCount} messages weren't sent.`, batchResponse);

    // // Clean up the tokens that are not registered any more.
    // for (let i = 0; i < batchResponse.responses.length; i++) {
    //   const errorCode = batchResponse.responses[i].error?.code;
    //   const errorMessage = batchResponse.responses[i].error?.message;
    //   if (
    //     errorCode === 'messaging/invalid-registration-token' ||
    //     errorCode === 'messaging/registration-token-not-registered' ||
    //     (errorCode === 'messaging/invalid-argument' &&
    //       errorMessage ===
    //         'The registration token is not a valid FCM registration token')
    //   ) {
    //     log(`Removing invalid token: ${messages[i].token}`);
    //     await tokensRef.child(messages[i].token).remove();
    //   }
    // }
  }
);

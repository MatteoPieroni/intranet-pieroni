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
import {
  onDocumentCreated,
  onDocumentUpdated,
} from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { MailerSend } from 'mailersend';
import {
  handleIssueUpdate,
  handleIssueCreation,
  handleIssueActionUpdate,
} from './handlers/issues';
import {
  handleRiscossoCreation,
  handleRiscossoUpdate,
} from './handlers/riscossi';

initializeApp();
const db = getFirestore();

/**
New item creation
- send email and notification to admin IDs 

Item update
- (also for subcollections)
- check for recent notification
  - yes: delete the old one
- add notification
- send email

Entity checked
- email and notification to creator
- archive
*/

/**CHECK LOGIN FOR CASAIMMOBILIARE */

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_SEND_TOKEN || '',
});

export const onRiscossoCreation = onDocumentCreated(
  '/riscossi/{id}',
  async (...args) => await handleRiscossoCreation(db, mailerSend, ...args)
);

export const onRiscossoUpdate = onDocumentUpdated(
  '/riscossi/{id}',
  async (...args) => await handleRiscossoUpdate(db, mailerSend, ...args)
);

export const onIssueCreation = onDocumentCreated(
  '/issues/{id}',
  async (...args) => await handleIssueCreation(db, mailerSend, ...args)
);

export const onIssueUpdate = onDocumentUpdated(
  '/issues/{id}',
  async (...args) => await handleIssueUpdate(db, mailerSend, ...args)
);

// count this as an update since it's a subcollection
export const onIssueActionCreation = onDocumentCreated(
  '/issues/{id}/timeline/{actionId}',
  async (...args) => await handleIssueActionUpdate(db, ...args)
);

export const onIssueActionUpdate = onDocumentUpdated(
  '/issues/{id}/timeline/{actionId}',
  async (...args) => await handleIssueActionUpdate(db, ...args)
);

/**
Team deletion
  - remove team from users
  - remove team from links

User deletion
  - change issue owner to dummy
  - change riscosso owner to dummy
 */

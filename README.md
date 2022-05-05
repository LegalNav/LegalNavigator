# Legal Navigator README
## About
The Legal Navigator project compiles legal resources freely and publicly for those who need them. At the time of writing, the project is officially used by the states Alaska and Hawaii.

## Disclaimer
No form of setup support is guaranteed for this repository. The Installation/Setup section is all that is provided.

## Prequisites
Be sure that the following are set up and up to date before continuing:

- NPM & Node JS
- Wordpress (WP)

## APIs
In order for Legal Navigator to function as expected, API keys will need to be created for the following services:

- **Google Maps** -- Shows organization resources on a map for single resource pages and resource list pages.

- **Google Translate** -- Translates site searches in Non-English languages as both the site content and SPOT functionality are in English.

- **Google Geolocation** -- Lists organization resources by proximity to user via 'Find My Location' feature on Legal Navigator.

- **SPOT** -- Maps LIST topics based to natural language input for the Guided Assistant search feature. Setup for this API is covered in the 'API Setup' section of this document.

- **Legal Server** -- Links Legal Server resources to Legal Navigator, as well as provides support for Legal Server Guided Assistants. Setup for this API is covered in the 'API Setup' section of this document.

## Installation/Setup
### File Setup
Once an instance of Wordpress (WP) is set up (either locally or on a server):

1. Navigate into the `wp-content` directory and add the contents of the repository's  `plugins` directory to WP's `plugins` directory.

2. Add the `legalnav` theme directory to the `themes` directory of the WP instance.
3. From the WP dashboard, navigate to 'Appearances->Themes' and select the Legal Nav theme.
4. From the WP dashboard, navigate to 'Plugins->Installed Plugins' and make sure all of the plugins are installed and activated.

### Advanced Custom Fields (ACF) Setup

1. **ACF Pro is required for all site functionality to work as expected.** You can purchase a liscense here: https://www.advancedcustomfields.com/pro/

2. After activating ACF Pro, from the WP dashboard, navigate to 'Custom Fields->Tools' and click the import button on the right hand side

3. Retrieve the `acf-fields-export.json` file from the repository and select this file for import.

_If successful, you should see a message detailing the fields that were added._

_If you do not see the ACF Pro tab from the WP dashboard sidebar, make sure that you have added the proper plugins to the `plugins` directory as detailed in the first step of the File Setup section above._

### API Setup

#### SPOT API

For information about the SPOT API, visit: https://app.swaggerhub.com/apis-docs/suffolklitlab/spot/0.0.1#/default/post_actions_

1. To get a Bearer Token, navigate to: https://spot.suffolklitlab.org/user/new/ and create a new developer account.
2. After creating an account and logging in, the https://spot.suffolklitlab.org/user/token/ page should show you your 'Bearer Token'. This will be used later in the 'API Configuration' section of this document.

#### Legal Server API



#### Court Case Look Up API

In the fields for creating a new State taxonomy, there is a 'Court Look Up API Settings' section. This API is state specific for the main Legal Navigator site and set up for it is not covered in this document.

### API Configuration
While some of the APIs can be configured via a settings page in the Wordpress theme, a few APIs must be configured by editing a JavaScript file.

#### Backend APIs

1. Via the WP dashboard, navigate to 'Theme General Settings->APIs'.

2. Enter credentials for the listed APIs

   - For SPOT, the 'Bearer Token' is revieced when setting up the SPOT API.

   - For Legal Server, setting up the API access should grant you a 'Process ID' along with a 'Token'.

   - For Google Maps, the 'Google Maps Key' is the key you created when setting up the API.

#### JavaScript APIs

This project uses Gulp in order to bundle all of the source JavaScript files. Before changing any JavaScript files be sure to run `npm install` from the repository's root directorty in order to use Gulp and its dependencies.

1. Open `legalnav/assets/source/global.js`. At the top of the file, there should be a `config` object with two properties.
2. Assign `spotBearerToken` to the SPOT Bearer Token you revieced from setting up the SPOT API.
3. Assign `geocodeKey` to the API key you've created for Google Geocode.

**Be sure to run `gulp` after making any JavaScript changes.**

*If the `gulp` command does not work, try removing the `node_modules` directory and `package-lock.json` file and re-running `npm install`.*

## CMS Usage

A user manual for the CMS functions of this WP site is included in the repository. The PDF is entitled `CMS_User_Manual.pdf`.

## Information on Guided Assistants
Guided Assistants (GA's) are surveys that recommend next steps for users seeking information related to a particular legal issue. Legal Navigator supports GA's created by Access 2 Justice (A2J) and Legal Server.

In the case of Legal Server GA's, the interviews are accessed via an API call when a GA of type Legal Server is added.

A2J GA's on the other hand, are comprised of various files exported as a ZIP file from the A2J Author tool: https://www.a2jauthor.org/. Exported ZIP files are uploaded to Legal Navigator and live in the `unzipped_gas` directory within `uploads`.

## Access 2 Justice (A2J) Integration
The official Legal Navigator website has worked with the A2J team in order to have their list of resources available from the A2J Author tool (Used to create Guided Assistants). In order for another instance of Legal Navigator to support this functionality, the respective party must reach out to A2J themselves.

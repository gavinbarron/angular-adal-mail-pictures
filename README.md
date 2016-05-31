# angular-adal-mail-pictures
Microsoft Graph powered AngularJS application using ADAL to find and display images sent to you from a given email address. Now with the ability to write the file into SharePoint online

## Set up

### Azure Active Directory Application

Create an Azure Active Directory Application which requests Read Mail for the Microsoft Graph and Read Write items in all Site Collections for SharePoint Online.

Download the manifest for the AAD Application and set `"oauth2AllowImplicitFlow": true` then upload the saved manifest back to Azure

**Note: I'll write up a blog post to expand on this section**

### Code changes

0. `app.config.js` -> set the value for appId to the ClientID for your Azure AD Application
0. `app.adalconfig.js` -> change <tenant> to match the name of you Office365 tenant
0. `home/dataservice.js` -> edit the webUri and libraryTitle properties on lines 13 and 14 to hold the url of the sharepoint site and title of the library to write to your files to

### Run the dev site

In your command prompt use gulp to run up a node server: `gulp serve`

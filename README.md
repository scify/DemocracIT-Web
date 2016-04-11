# Public consultation platform

Democracit is a web application with the goal to improve the consultation process.
Check the demo below
http://demo.democracit.org <br/>

And an instance of democracit targeted in the open consultation process in Greece
http://www.democracit.org <br/>
http://www.scify.gr/site/en/projects/in-progress/democraciten

## Roadmap/ Issues

http://jira.scify.org/secure/RapidBoard.jspa?rapidView=9&projectKey=DW&view=planning

## Setup instructions


### Set up enviroment variables
```
$ sudo nano /etc/environment
```

Add 3 database related properties
```
$ democracit_db_con_string="jdbc:postgresql://your-host-name-here/databaseNameHere"
$ democracit_db_user="db-username"
$ democracit_db_pw="db-password"
```

Add 4 social login related fields

```
$ FACEBOOK_CLIENT_ID=id goes here
$ FACEBOOK_CLIENT_SECRET=secret goes here
$ TWITTER_CONSUMER_KEY=key goes here
$ TWITTER_CONSUMER_SECRET=secret goes here
```

Add the play app secret (for production configuration - you can generate it by running activator playGenerateSecret command)

```
$ PLAY_APP_SECRET= secret goes here 
```

Add the email server settings

```
$ SMTP_HOST= smtp host goes here
$  SMTP_PORT= smtp port goes here
$  SMTP_USERNAME= smtp username goes here
$ SMTP_PASS=smtp password goes here
```

Add the language settings (e.g. "en" for English or "el" for Greek)
```
$ democracit_lang = "en"
```
### Set up the Sass/SCSS transpiler (webstorm and intellij)

https://www.jetbrains.com/idea/help/transpiling-sass-less-and-scss-to-css.html#d532231e166


### Set up the React/JSX transpiler (webstorm and intellij)
http://babeljs.io/docs/setup/#webstorm

### Set up the React/JSX transpiler (intellij 15)
http://blog.jetbrains.com/webstorm/2015/05/ecmascript-6-in-webstorm-transpiling/

If you are using intellij you may have to go to  Tools > File watchers and add Babel. In the watcher setting add a new scope with the pattern
file[root]:public/js/*.jsx
If you do not do this, Babel also parses the .js files since the file type is "Javascript" (there is no JSX file type in intellij)
Make sure you specify the file type that the watcher will “watch” for you and run the program.
If you use some custom file extension, e.g. .es6 or .jsx, check that it’s associated with JavaScript file type in Preferences | Editor | File types

# Strengthening Participatory Democracy

Nowadays, in Greece, there is a vast amount of data which arise from the draft laws public consultation. This type of consultation allows citizens to express their views, suggestions, arguments, or disagreements which are associated with the ongoing legislation. However, the current consultation system and its infrastructure discourage citizens from participating and, moreover, it does not offer policy analysts and shapers the necessary tools to take full advantage of citizens’ participation. Furthermore, there is no direct way to determine the impact of the consultation on drafting the final law.

http://www.scify.gr/site/en/projects/in-progress/democraciten

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

And 4 social login related fields

```
$ FACEBOOK_CLIENT_ID=id goes here
$ FACEBOOK_CLIENT_SECRET=secret goes here
$ TWITTER_CONSUMER_KEY=key goes here
$ TWITTER_CONSUMER_SECRET=secret goes here
```

And the play app secret (for production configuration - you can generate it by running activator playGenerateSecret command)

```
$ PLAY_APP_SECRET= secret goes here 
```

### Set up the Sass/SCSS transpiler (webstorm and intellij)

https://www.jetbrains.com/idea/help/transpiling-sass-less-and-scss-to-css.html#d532231e166


### Set up the React/JSX transpiler (webstorm and intellij)
http://babeljs.io/docs/setup/#webstorm

If you are using intellij you may have to go to  Tools > File watchers and add Babel. In the watcher setting add a new scope with the pattern
file[root]:public/js/*.jsx
If you dont this Babel also parses the .js files since the file type is "Javascript" (there is no JSX file type in intellij)
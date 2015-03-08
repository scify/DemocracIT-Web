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
$ democracit_db_host="jdbc:postgresql://your-host-name-here/databaseNameHere"
$ democracit_db_user="db-username"
$ democracit_db_pw="db-password"
```

### Set up the Sass/SCSS transpiler

https://www.jetbrains.com/idea/help/transpiling-sass-less-and-scss-to-css.html#d532231e166
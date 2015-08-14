
name := """DemocracIT"""

version := "0.0-SNAPSHOT"

scalaVersion := "2.11.7"

resolvers := ("Atlassian Releases" at "https://maven.atlassian.com/public/") +: resolvers.value

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"

resolvers += Resolver.sonatypeRepo("snapshots")

// http://www.ocpsoft.org/prettytime/ format hours/dates
libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  filters,
  "com.mohiva" %% "play-silhouette" % "3.0.0",
  "org.webjars" %% "webjars-play" % "2.4.0",
  "net.codingwell" %% "scala-guice" % "4.0.0",
  "net.ceedubs" %% "ficus" % "1.1.2",
  "com.adrianhurt" %% "play-bootstrap3" % "0.4.4-P24",
  "com.mohiva" %% "play-silhouette-testkit" % "3.0.0" % "test",
  "org.ocpsoft.prettytime" % "prettytime" % "3.2.7.Final",
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc41",
  "org.specs2" %% "specs2-core" % "3.0.1" % "test",
  "com.typesafe.play" %% "anorm" % "2.4.0"
)

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalacOptions in Test ++= Seq("-Yrangepos")

TwirlKeys.templateImports ++=Seq("model.dtos._")

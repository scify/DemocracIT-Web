
name := """DemocracIT"""

version := "0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"

// http://www.ocpsoft.org/prettytime/ format hours/dates
libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "net.codingwell" %% "scala-guice" % "4.0.0-beta5",
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc41",
  "org.specs2" %% "specs2-core" % "3.0.1" % "test",
  "org.ocpsoft.prettytime" % "prettytime" % "3.2.7.Final",
  "com.mohiva" %% "play-silhouette" % "2.0-RC2",
  "com.mohiva" %% "play-silhouette-testkit" % "2.0-RC2" % "test",
  "org.webjars" %% "webjars-play" % "2.3.0",
  "org.webjars" % "bootstrap" % "3.1.1",
  "org.webjars" % "jquery" % "1.11.0"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

resolvers := ("Atlassian Releases" at "https://maven.atlassian.com/public/") +: resolvers.value

resolvers += Resolver.sonatypeRepo("snapshots")

scalacOptions in Test ++= Seq("-Yrangepos")

TwirlKeys.templateImports ++=Seq("model.dtos._")



name := """DemocracIT"""

version := "0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.4"

// http://www.ocpsoft.org/prettytime/ format hours/dates
libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.google.inject" % "guice" % "3.0",
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc41",
  "org.specs2" %% "specs2-core" % "3.0.1" % "test",
  "org.ocpsoft.prettytime" % "prettytime" % "3.2.7.Final"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

scalacOptions in Test ++= Seq("-Yrangepos")

TwirlKeys.templateImports ++=Seq("democracit.dtos._")



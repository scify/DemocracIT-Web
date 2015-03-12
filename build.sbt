name := """DemocracIT"""

version := "0.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.google.inject" % "guice" % "3.0",
  "org.postgresql" % "postgresql" % "9.3-1100-jdbc41",
  "org.specs2" %% "specs2-core" % "3.0.1" % "test"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

scalacOptions in Test ++= Seq("-Yrangepos")

//play.PlayImport.PlayKeys.routesImport += "democracit.utils.binders"


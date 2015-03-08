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
  "org.scalatest" % "scalatest_2.11" % "2.2.1" % "test"
)


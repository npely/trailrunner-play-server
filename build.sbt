lazy val root = (project in file("."))
  .enablePlugins(PlayScala).settings(
  name := """trailrunner-play-server""",
  version := "1.0-SNAPSHOT",
  scalaVersion := "2.13.3",
  libraryDependencies ++= Seq(
    guice,
    "com.h2database" % "h2" % "1.4.199",
    "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
    "de.htwg.se" %% "trailrunner" % "0.1"
  ),
  scalacOptions ++= Seq(
    "-feature",
    "-deprecation",
    "-Xfatal-warnings"
  )
)

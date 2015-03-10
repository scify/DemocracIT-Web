import com.google.inject.{Guice, AbstractModule}
import play.api.GlobalSettings

/**
 * Set up the Guice injector and provide the mechanism for return objects from the dependency graph.
 */
object Global extends GlobalSettings {

  /**
   * Bind types such that whenever TextGenerator is required, an instance of WelcomeTextGenerator will be used.
   */
  val injector = Guice.createInjector(new AbstractModule {
    protected def configure() {
      //bind(classOf[SearchManagerAbstract]).to(classOf[ConsultationManager])
    }
  })

  /**
   * Controllers must be resolved through the application context. There is a special method of GlobalSettings
   * that we can override to resolve a given controller. This resolution is required by the Play router.
   */
  override def getControllerInstance[A](controllerClass: Class[A]): A = injector.getInstance(controllerClass)
}

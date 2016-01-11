package modules

import com.google.inject.{AbstractModule, Provides}
import model.User
import model.repositories._
import model.services.{GameEngine, GameEngineTrait, UserService, UserServiceImpl}
import net.ceedubs.ficus.Ficus._
import net.ceedubs.ficus.readers.ArbitraryTypeReader._
import net.codingwell.scalaguice.ScalaModule
import play.api.Configuration
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.openid.OpenIdClient
import play.api.libs.ws.WSClient

/**
 * The Guice module which wires all Silhouette dependencies.
 */
class DemocracitModule extends AbstractModule with ScalaModule {

  /**
   * Configures the module.
   */
  def configure() {

    /*
      * This tells Guice that whenever it sees a dependency on a TransactionLog,
      * it should satisfy the dependency using a DatabaseTransactionLog.
      */
    bind[GameEngineTrait].to[GameEngine]

  }


}

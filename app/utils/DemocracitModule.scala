package modules

import com.google.inject.AbstractModule
import model.services._
import net.codingwell.scalaguice.ScalaModule

/**
 * The Guice module which wires all  dependencies on application root (application root is like the main)
 */
class DemocracitModule extends AbstractModule with ScalaModule {

  /**
   * Configures the module.
   */
  def configure() {

    /*
      * This tells Guice that whenever it sees a dependency on a GameEngineTrait,
      * it should satisfy the dependency using a GameEngine.
      */
    bind[GamificationEngineTrait].to[GamificationEngine]

    /*bind[RewardRuleTrait].to[RewardRule_UploadFinalLaw]
    bind[RewardRuleTrait].to[RewardRule_CommentOnConsultation]*/

    /*var gamificationRulesBinder = Multibinder.newSetBinder(binder(),GamificationEngineTrait.getClass())
    var x = new RewardRule_CommentOnConsultation()
    var y = new RewardRule_UploadFinalLaw()

    gamificationRulesBinder.addBinding().to(x.getClass())
    gamificationRulesBinder.addBinding().to(y.getClass())*/

    //TODO: check
    /*var gamificationRulesBinder =Multibinder.newSetBinder(binder(), RewardRuleTrait.getClass())
    gamificationRulesBinder.addBinding().toInstance(new RewardRule_UploadFinalLaw())
    gamificationRulesBinder.addBinding().toInstance(new RewardRule_CommentOnConsultation())*/


  }


}

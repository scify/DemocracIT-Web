package modules

import com.google.inject.AbstractModule
import model.services.rewardRules._
import model.services._
import net.codingwell.scalaguice.{ScalaModule, ScalaMultibinder}

/**
 * The Guice module which wires all  dependencies on application root (application root is like the main)
 */
class DemocracitModule extends AbstractModule with ScalaModule{

  /**
   * Configures the module.
   */
  def configure() {

    /*
      * This tells Guice that whenever it sees a dependency on a GameEngineTrait,
      * it should satisfy the dependency using a GameEngine.
      */
    bind[GamificationEngineTrait].to[GamificationEngine]

    var gamificationRulesBinder =ScalaMultibinder.newSetBinder[RewardRuleTrait](binder)
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_CommentOnConsultationArticle])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_CommentOnConsultationParagraph])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_UploadFinalLaw])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_UploadedFileRatedLike])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_UploadedFileRatedDislike])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_RemoveUploadedFile])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_RateLaw])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_LikeComment])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_CommentWithAnnTags])
    gamificationRulesBinder.addBinding.to(classOf[RewardRule_CommentWithProblemTags])
  }


}



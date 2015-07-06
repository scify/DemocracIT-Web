import org.joda.time.DateTime
import play.api.test.FakeApplication
import play.api.test.Helpers._
import org.specs2.mutable._
import model.services._
import model.dtos._

class DBRepositoriesSpec extends Specification  {

//  "Search manager" should {
//      "should return results " in {
//        running(FakeApplication()) {
//          val consultationManager = new ConsultationManager();
//          val consultations = consultationManager.search(new ConsultationSearchRequest(-1,"Νόμος",-1))
//          consultations.length > 1
//        }
//      }
//    }

//  "Comment manager" should {
//    "save comment" in {
//      running(FakeApplication()) {
//        val articleId = 60034
//        val consultationId = 60035
//
//        val commentsManager = new CommentManager();
//        val comment = model.dtos.Comment(id = -1,
//                              articleId = articleId,
//                              source = CommentSource.Democracit,
//                               body = "αυτό ειναι ενα δοκιμαστικό σχόλιο",
//                               userId = "1",
//                               fullName = "alexandros tzoumas",
//                               dateAdded = DateTime.now().toDate ,
//                               revision = 1 ,
//                               depth = "1",
//                               annotations = Nil,
//                               discussionThread = None)
//
//        val result =commentsManager.saveComment(comment)
//
//        result.id>0
//      }
//    }
//}

//
//  "Search manager" should "return results for query 'Νόμος'" in {
//    val consultationManager = new ConsultationManager();
//    consultationManager.search(new ConsultationSearchRequest(-1,"Νόμος",-1))
//    true should be (true)
//
//  }
}
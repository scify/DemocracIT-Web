import play.api.test.FakeApplication
import play.api.test.Helpers._
import org.specs2.mutable._
import model.services._
import model.dtos._

class DBRepositoriesSpec extends Specification  {

  "Search manager" should {
      "should return results " in {
        running(FakeApplication()) {
          val consultationManager = new ConsultationManager();
          val consultations = consultationManager.search(new ConsultationSearchRequest(-1,"Νόμος",-1))
          consultations.length > 1
        }
      }
    }

//
//  "Search manager" should "return results for query 'Νόμος'" in {
//    val consultationManager = new ConsultationManager();
//    consultationManager.search(new ConsultationSearchRequest(-1,"Νόμος",-1))
//    true should be (true)
//
//  }
}
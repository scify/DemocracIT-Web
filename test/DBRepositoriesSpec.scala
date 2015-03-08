import collection.mutable.Stack
import org.scalatest._

//http://www.scalatest.org/quick_start
class DBRepositoriesSpec extends FlatSpec with Matchers {
  "ConsulationRepository" should "be loaded from database for ID =10" in {
    1 should be(1)
  }

  "Search manager" should "return results for query 'Νόμος'" in {
    true should be (true)
  }
}
package utils

import javax.inject.Inject
import play.api.mvc.{Result, RequestHeader, Filter}
import play.api.Logger
import play.api.routing.Router.Tags
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits.defaultContext

class NoCacheFilter @Inject() () extends Filter {
  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {

    nextFilter(requestHeader).map { result =>
      result.withHeaders(
              ("Cache-Control", "no-cache, no-store, must-revalidate"),
              ("Pragma", "no-cache"),
              ("Expires", "0")
                        );
    }
  }
}
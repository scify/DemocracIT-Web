package model.services

import java.util.{Calendar, Date, UUID}

import model.repositories.TokenRepository
import org.joda.time.DateTime

import scala.concurrent.Future

case class TokenUser (id: String, email: String, expirationTime: java.util.Date, isSignUp: Boolean,
                      firstName: String, lastName: String) extends Token {
  def isExpired: Boolean = {
    expirationTime.before(new Date())
  }
}

object TokenUser {

  private val hoursTillExpiry = 24

  private def getExpiryDate():java.util.Date= {
    val cal = Calendar.getInstance(); // creates calendar
    cal.setTime(new Date()); // sets calendar time/date
    cal.add(Calendar.HOUR_OF_DAY, hoursTillExpiry); // adds one hour
    cal.getTime()
  }

  def apply (email: String, isSignUp: Boolean, firstName: String, lastName: String): TokenUser =
    TokenUser(UUID.randomUUID().toString, email,getExpiryDate(), isSignUp, firstName, lastName)

  def apply (email: String): TokenUser =
    TokenUser(UUID.randomUUID().toString, email,  getExpiryDate(), false, "", "")

  def findById (id: String): Future[Option[TokenUser]] = {
    val repo = new TokenRepository()
    Future.successful(repo.findById(id))
  }

  def save (token: TokenUser): Future[TokenUser] = {
    val repo = new TokenRepository()
    Future.successful(repo.save(token))
  }

  def delete (id: String): Unit = {
    val repo = new TokenRepository()
    Future.successful(repo.delete(id))
  }
}

package services

import javax.inject.Singleton

/**
 * A type declaring the interface that will be injectable.
 */
abstract class TextGenerator(val welcomeText: String)

/**
 * A simple implementation of TextGenerator that we will inject.
 */
@Singleton
class WelcomeTextGenerator extends TextGenerator("Welcome!")
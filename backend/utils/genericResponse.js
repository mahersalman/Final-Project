function okGeneric(res) {
  return res.json({
    message:
      "If an account exists for that email/username, a reset link has been sent.",
  });
}
module.exports = { okGeneric };

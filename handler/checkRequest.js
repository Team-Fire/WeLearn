exports.checkMenuClick=function(msg)
{

  if (msg.MsgType==="event")
  {
    if (msg.Event==="CLICK")
    {
      return msg.EventKey;
    }
  }

  return "Attention, it cannot be pattern-matched anyway.";
};
exports.checkSubscribe=function(msg)
{

  if (msg.MsgType[0]==="event")
    if (msg.Event[0]==="subscribe")
    {
      return true;
    }
  return false;
};

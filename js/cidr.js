function IPAddr(ip) {
  this.ip = ip;
  this.split = ip.split('.');
  for(var i in this.split) {
    this.split[i] = parseInt(this.split[i]);
  }
}

IPAddr.from_cidr = function(cidr) {
  var mask = '';
  var tempcidr = cidr;
  for(var i=0; i < 32; i++) {
      if(tempcidr > 0) {
          mask += 1;
      }
      else {
          mask += 0;
      }
      tempcidr--;

      if(i != 31 && (i + 1) % 8 == 0) {
          mask += '.';
      }
  }

  var mask_split = mask.split('.');
  for(var i in mask_split) {
      mask_split[i] = parseInt(mask_split[i], 2);
  }

  return new IPAddr(mask_split.join('.'));
}

IPAddr.from_array = function(array) {
  return new IPAddr(array.join('.'));
}

IPAddr.prototype.toString = function() {
  return this.ip;
}

IPAddr.prototype.get_inverted = function() {
  var inverted = Array(4);
  for(var i=0; i < 4; i++) {
      inverted[i] = this.split[i] ^ 255;
  }
  return inverted;
}

IPAddr.prototype.get_range_from_mask = function(mask) {
  var start = Array(4);
  for(var i=0; i < 4; i++) {
      start[i] = this.split[i] & mask.split[i];
  }

  var inverted_mask = mask.get_inverted()
  var broadcast = Array(4);
  for(var i=0; i < 4; i++) {
      broadcast[i] = this.split[i] | inverted_mask[i]
  }

  return { 
    start: IPAddr.from_array(start),
    end: IPAddr.from_array(broadcast)
  }
}

function is_valid_ip(ip) {
  var split = ip.split('.');
  if(split.length != 4) {
    return false;
  }
  for(var i in split) {
    if(!split[i].match('^\\d+$')) {
      return false;
    }
    if(split[i] < 0 || split[i] > 255) {
      return false;
    }
  }
  return true;
}

function is_valid_cidr(cidr) {
  var num_bits = parseInt(cidr);
  return num_bits >= 1 && num_bits <= 32;
}
const bcrypt = require('bcryptjs');

async function generateAdminHash() {
  const password = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\n🔐 Hash generado para "admin123":');
  console.log(hash);
  console.log('\n📋 Copia este hash y úsalo en el UPDATE de abajo\n');
}

generateAdminHash();
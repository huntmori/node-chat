import argon2 from 'argon2';


(async () => {
    const hashedPwd = await argon2.hash('1q2w3e');
    console.log(hashedPwd);

    const test: boolean = await argon2.verify('$argon2id$v=19$m=65536,t=3,p=4$jjt9pnrSLlZ/EhWwOiRR4w$pKFSWnjBPkloKrb+xZNFZcR8Fg6s1GErt8kmzG94a3Y', '1q2w3e');

    console.log('test', test);
    return hashedPwd;
})();


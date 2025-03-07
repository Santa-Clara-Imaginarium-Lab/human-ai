export async function verifyPassword(password, which) {
    return new Promise((resolve, reject) => {
        // getHash();
        const encoder = new TextEncoder();
        const salt = import.meta.env.VITE_LOGIN_SALT;
        let correctHash;

        const encodedString = encoder.encode(salt.toString() + password + salt.toString());
        // console.log("in testing", encodedString)
    
        switch (which) {
            case "login":
                correctHash = import.meta.env.VITE_LOGIN_HASH;
                
                crypto.subtle.digest("SHA-256", encodedString).then(hash => {
                const hashString = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
                // console.log(hashString.toString());
                // console.log(correctHash.toString());
                    if (hashString.toString() === correctHash.toString()) {
                        console.log("Successful Research Login!");
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
                break;
    
            case "adminPanel":
                correctHash = import.meta.env.VITE_ADMIN_HASH;
                
                crypto.subtle.digest("SHA-256", encodedString).then(hash => {
                const hashString = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
                // console.log(hashString.toString());
                // console.log(correctHash.toString());
                    if (hashString.toString() === correctHash.toString()) {
                        console.log("Admin Panel Clearance Granted!");
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
                break;    
    
            default:
                console.warn("Error: no case given!")
                resolve(false);
        }    
    })
}
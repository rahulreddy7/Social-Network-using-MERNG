module.exports={
    registerValidation:(username,password,confirmpassword,email)=>{
            const errors={};
            if(username.trim()===""){
                errors.username="Username cannot be empty";

            }
            if(email.trim()===""){
                errors.email="Email cannot be empty";
            }else{
                const regex=/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
                if(!email.match(regex)){
                    errors.email="Not a valid email address";
                }
            }
            if(password===""){
                errors.password="Password cannot be empty";
            }else if(password!==confirmpassword){
                errors.confirmPassword="Password and Confirm password should match";
            }
            return {
                errors:errors,
                valid:Object.keys(errors).length<1
            }
    },

    loginValidation:(username,password)=>{
        const errors={};
            if(username.trim()===""){
                errors.username="Username cannot be empty";

            }
            if(password===""){
                errors.password="Password cannot be empty";
            }
            return {
                errors:errors,
                valid:Object.keys(errors).length<1
            }
    }
}
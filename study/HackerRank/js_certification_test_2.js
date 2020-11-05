class StaffList {
    constructor(){
        this.staffMemberList = new Array();
    };
    getMemberNames(){
        return new Set(this.staffMemberList.map(member => member.name));
    };
    add(name, age){
        const staffMemberNames = this.getMemberNames();
        if (! staffMemberNames.has(name)){
            let ageValidated = "";
            switch(true){
                case (age > 20):
                    ageValidated = age;
                    break;
                case (age <= 20):
                    throw Error('Staff member age must be greater than 20');
                    break;
            };
            const member = {
                name,
                age: ageValidated,
            };
            return this.staffMemberList.push(member);
        };
    };
    remove(name){
        let targetMemberIdx = null;
        this.staffMemberList.forEach((member, idx) => {
            if(member.name === name){
                targetMemberIdx = idx;
            };
        });
        if (targetMemberIdx != null){
            this.staffMemberList.pop(targetMemberIdx);
            return true;
        };
        return false;
    };
    getSize(){
        return this.staffMemberList.length;
    }
};

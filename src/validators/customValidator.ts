import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({name: "customStatusValidator", async:false})
export class CustomStatusValidator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        if(typeof text === undefined || typeof text === "undefined"){
            return false;
        }
        return text.includes("PENDING") || text.includes("COMPLETED");
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return 'Text ($value) is too short or too long!';
    }
}
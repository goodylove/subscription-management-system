import  mongoose  from "mongoose";



const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " subscription  name is required"],
      minLength: 2,
      trim: true,
      maxLength: 100,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: "String",
      enum: [
        "sport",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "others",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      required: true,
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      
      validate: {
        validator: function(value){return value > this.startDate},
        message: "Renewal date must be after start date",
      },
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
  },
  { timestamps: true }
);



//  auto save renewal date  before saving the document

subscriptionSchema.pre("save",function(next){
    if(!this.renewalDate){
        const renewalPeriod= {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        }

        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
    }
    //  auto update status if renewal date has passed

    if(this.renewalDate <  new Date()){
        this.status = "expired"

    }
    next()
})


const Subscription = mongoose.model("Subscription",subscriptionSchema)

export default Subscription
import { Request, Response } from "express";
import resturantModel from "../models/resturant-model";

const searchResturant = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    console.log("searh");
    let query: any = {};

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    query["city"] = { $regex: city, $options: "i" };
    const resturantsCount = await resturantModel.countDocuments(query);

    if (resturantsCount === 0) {
      return res.json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      // query["restaurantName"] = { $regex: searchQuery, $options: "i" };
      // query["cuisines"] = { $in: [searchRegex] };
      query["$or"] = [
        { resturantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const restaurants = await resturantModel
      .find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await resturantModel.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    console.log(response);

    res.json(response);
  } catch (error) {
    res.status(500).json({
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pages: 1,
      },
    });
  }
};

export const getResturantById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) throw new Error("Please Enter Valid ID");

    const resturant = await resturantModel.findById(id);

    if (!resturant)
      throw new Error("Restaurant not found -- getRestaurantByID Func--");

    res.json(resturant);
  } catch (error) {
    console.log(error);
    res.status(500).send("Unable to get restaurant");
  }
};

export default {
  searchResturant,
  getResturantById,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import { CollectionService } from "@app/services/collection.service";
import type { CreateApiRequestPostBody } from "@deprecate/utils/dto";
import { UntrackedItems } from "@deprecate/utils/enums/item-type.enum";
import { moveNavigation } from "@deprecate/utils/helpers/navigation";
import type { CollectionsMethods } from "@deprecate/utils/interfaces/collections.interface";

import { generateSampleRequest } from "@deprecate/utils/sample/request.sample";
import { v4 as uuidv4 } from "uuid";

export class MyCollectionViewModel {
  private collectionService = new CollectionService();
  constructor() {}

  /**
   * @param collectionsMethods - Methods object coming from Collection View Model
   */

  public addRequest = async (requestData: CreateApiRequestPostBody) => {
    return await this.collectionService.addRequestInCollection(requestData);
  };

  public addRequestInFolderInCollection = async (
    requestData: CreateApiRequestPostBody,
  ) => {
    return await this.collectionService.addRequestInCollection(requestData);
  };

  public modifyCollection = async (
    componentData,
    property: string,
    value: string,
    collectionsMethods: CollectionsMethods,
  ) => {
    const updateObj = {};
    updateObj[property] = value;
    const updateCollectionElement =
      await this.collectionService.updateCollectionData(
        componentData.path.collectionId,
        componentData.path.workspaceId,
        updateObj,
      );

    collectionsMethods.updateCollection(
      componentData.path.collectionId,
      updateCollectionElement.data.data,
    );

    collectionsMethods.updateTab(
      value,
      property,
      componentData.path.collectionId,
    );

    collectionsMethods.updateTab(true, "save", componentData.path.collectionId);

    Promise.resolve().then(() => {
      moveNavigation("right");
    });
  };

  public createApiRequest = async (
    componentData,
    collectionsMethods: CollectionsMethods,
    currentCollection,
  ) => {
    let userSource = {};
    if (currentCollection?.activeSync) {
      userSource = {
        currentBranch: currentCollection?.currentBranch,
        source: "USER",
      };
    }
    const request = generateSampleRequest(
      UntrackedItems.UNTRACKED + uuidv4(),
      new Date().toString(),
    );
    const requestObj = {
      collectionId: componentData.path.collectionId,
      workspaceId: componentData.path.workspaceId,
      ...userSource,
      items: {
        name: request.name,
        type: request.type,
        request: {
          method: request.property.request.method,
        },
      },
    };
    collectionsMethods.addRequestOrFolderInCollection(
      componentData.path.collectionId,
      {
        ...requestObj.items,
        id: request.id,
      },
    );
    const response = await this.addRequest(requestObj);

    if (response.isSuccessful && response.data.data) {
      const res = response.data.data;
      collectionsMethods.updateRequestOrFolderInCollection(
        componentData.path.collectionId,
        request.id,
        res,
      );
      request.id = res.id;
      request.path.workspaceId = componentData.path.workspaceId;
      request.path.collectionId = componentData.path.collectionId;
      collectionsMethods.handleCreateTab(request);

      moveNavigation("right");
      return response;
    } else {
      collectionsMethods.deleteRequestOrFolderInCollection(
        componentData.path.collectionId,
        request.id,
      );
      return response;
    }
  };
}

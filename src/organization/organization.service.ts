import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';
import { CreateOrganizationDto } from './DTO/create-organization.dto';
import { CreateDepartmentDto } from './DTO/create-department.dto';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { UpdateDepartmentDto } from './DTO/update-department.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Organization) // Inject Organization Repository to check FK constraint
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  /**
   * Creates a new organization.
   * @param createOrganizationDto Data to create the organization.
   * @returns The newly created organization entity.
   */
  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const newOrganization = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(newOrganization);
  }

  // --- Helper to validate Organization FK ---
  private async findOrganization(code: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { code },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with code "${code}" not found. Cannot link department.`);
    }
    return organization;
  }

  /**
   * Creates a new department and links it to an existing organization.
   * @param createDepartmentDto Data to create the department.
   * @returns The newly created department entity.
   */
  async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { organizationCode, ...departmentData } = createDepartmentDto;

    // 1. Validate that the parent organization exists
    const organization = await this.findOrganization(organizationCode);

    // 2. Create the department entity and attach the organization object
    const newDepartment = this.departmentRepository.create({
      ...departmentData,
      code: organization.code, // Set the foreign key value
      organization: organization,
    });
    
    // 3. Save to database
    return this.departmentRepository.save(newDepartment);
  }

  
  /**
   * Retrieves all organizations, optionally loading their departments.
   * @param includeDepartments Flag to load related departments.
   * @returns An array of organization entities.
   */
  async findAll(includeDepartments: boolean = false): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: includeDepartments ? ['departments'] : [],
      order: { name: 'ASC' },
    });
  }

  /**
   * Retrieves a single organization by its unique code.
   * @param code The unique code of the organization.
   * @returns The organization entity.
   * @throws NotFoundException if the organization does not exist.
   */
  async findOne(code: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { code },
      relations: ['departments'], // Always load departments for single view
    });

    if (!organization) {
      throw new NotFoundException(`Organization with code "${code}" not found.`);
    }
    return organization;
  }

  /**
   * Updates an existing organization by its unique code.
   * @param code The unique code of the organization to update.
   * @param updateOrganizationDto Data to update the organization.
   * @returns The fully updated organization entity.
   * @throws NotFoundException if the organization does not exist.
   */
  async update(code: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    // 1. Attempt the update directly. We use the code in the WHERE clause.
    const updateResult: UpdateResult = await this.organizationRepository.update(
      { code },
      updateOrganizationDto,
    );

    // 2. Check the result: If no row was affected, the organization was not found.
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Organization with code "${code}" not found.`);
    }

    // 3. Fetch and return the fully updated entity with relations.
    return this.findOne(code);
  }

  /**
   * Removes an organization by its unique code.
   * @param code The unique code of the organization to remove.
   * @throws NotFoundException if the organization does not exist.
   */
  async remove(code: string): Promise<void> {
    // Using delete for simplicity, which returns a DeleteResult
    const result = await this.organizationRepository.delete({ code });

    if (result.affected === 0) {
      throw new NotFoundException(`Organization with code "${code}" not found.`);
    }
    // We don't need to return anything on successful deletion (void).
  }

  /**
   * Retrieves a single department by its primary ID.
   * @param id The UUID of the department.
   * @returns The department entity.
   * @throws NotFoundException if the department does not exist.
   */
  async findOneDepartment(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }
    return department;
  }

  async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const { organizationCode, ...departmentData } = updateDepartmentDto;
    // FIX: Initialize the variable to null to prevent "Variable 'organization' is used before being assigned"
    let organization: Organization | null = null; 

    // 1. If organizationCode is being updated, validate the new parent organization
    if (organizationCode) {
      organization = await this.findOrganization(organizationCode);
    }
    
    // 2. Attempt the update
    const updatePayload = {
        ...departmentData,
        // Pass the organization object if it was found (organization is not null)
        ...(organization && { organization, organizationCode: organization.code })
    };

    const updateResult: UpdateResult = await this.departmentRepository.update(
      { id },
      updatePayload,
    );

    // 3. Check the result
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }

    // 4. Fetch and return the fully updated department entity
    return this.findOneDepartment(id);
  }
}
